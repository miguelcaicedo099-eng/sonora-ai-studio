/**
 * SONORA AI - Serverless Credits & WebPay Endpoint (Vercel + Supabase)
 * Handles token balances, daily free credit grants, and WebPay top-ups
 */

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      configured: false,
      message: 'Supabase no está configurado en las variables de entorno aún. Usando estado local.'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId requerido' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits, has_infinite_tokens, role, is_vip')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    return res.status(200).json({
      credits: profile.has_infinite_tokens ? 999999 : profile.credits,
      hasInfiniteTokens: profile.has_infinite_tokens,
      role: profile.role,
      isVip: profile.is_vip
    });
  }

  if (req.method === 'POST') {
    // Top-up credits via WebPay transaction
    const { userId, packId, amountClp, creditsToAdd } = req.body || {};

    if (!userId || !creditsToAdd) {
      return res.status(400).json({ error: 'userId y creditsToAdd son requeridos' });
    }

    // 1. Record transaction in Supabase
    const txId = `tx-webpay-${Date.now()}`;
    await supabase.from('transactions').insert([
      {
        id: txId,
        user_id: userId,
        pack_id: packId || 'pack-pro',
        amount_clp: amountClp || 12990,
        credits_added: creditsToAdd,
        payment_method: 'WebPay Plus',
        status: 'approved'
      }
    ]);

    // 2. Increment credits in profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    const currentCredits = profile ? profile.credits : 50;
    const newTotal = currentCredits + creditsToAdd;

    await supabase
      .from('profiles')
      .update({ credits: newTotal, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return res.status(200).json({
      success: true,
      transactionId: txId,
      newCredits: newTotal
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
