/**
 * SONORA AI - Supabase Client & Cloud Sync Integration
 * Handles Authentication, User Profiles, Credit Synchronization, and Cloud Track Persistence
 */

class SonoraSupabaseClient {
  constructor() {
    this.client = null;
    this.user = null;
    this.isConfigured = false;

    // Default configuration (can be injected via environment or window.SONORA_CONFIG)
    this.supabaseUrl = (window.SONORA_CONFIG && window.SONORA_CONFIG.SUPABASE_URL) || localStorage.getItem('sonora_supabase_url') || 'https://yrpmyllauldmfruiogic.supabase.co';
    this.supabaseAnonKey = (window.SONORA_CONFIG && window.SONORA_CONFIG.SUPABASE_ANON_KEY) || localStorage.getItem('sonora_supabase_anon_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycG15bGxhdWxkbWZydWlvZ2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNTYwMTMsImV4cCI6MjEwNzkzMjAxM30.cSvmyZ6Es-ionh7i0cKpydpO3VTZUXU6jewUEMPGrGE';
  }

  /**
   * Initializes Supabase JS SDK if library and credentials are present
   */
  init() {
    if (window.supabase && this.supabaseUrl && this.supabaseAnonKey) {
      try {
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
        this.isConfigured = true;
        this.checkSession();
      } catch (err) {
        console.warn('Supabase initialization notice:', err);
      }
    } else {
      // Local fallback session
      this.initLocalGuestUser();
    }
  }

  initLocalGuestUser() {
    const savedUser = localStorage.getItem('sonora_current_user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (e) {
        this.user = this.createDefaultAdmin();
      }
    } else {
      this.user = this.createDefaultAdmin();
      localStorage.setItem('sonora_current_user', JSON.stringify(this.user));
    }
  }

  createDefaultAdmin() {
    return {
      id: 'usr-miguel-admin-01',
      email: 'miguel@sonora.ai',
      full_name: 'Miguel (Administrador)',
      role: 'admin',
      is_vip: true,
      has_infinite_tokens: true,
      credits: 999999
    };
  }

  async checkSession() {
    if (!this.client) return;
    try {
      const { data: { session } } = await this.client.auth.getSession();
      if (session && session.user) {
        await this.loadUserProfile(session.user.id, session.user.email);
      } else {
        this.initLocalGuestUser();
      }
    } catch (e) {
      this.initLocalGuestUser();
    }
  }

  async loadUserProfile(userId, email) {
    if (!this.client) return;
    try {
      const { data: profile } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        this.user = profile;
        localStorage.setItem('sonora_current_user', JSON.stringify(this.user));
        if (window.sonoraApp) {
          window.sonoraApp.userCredits = profile.has_infinite_tokens ? 999999 : profile.credits;
          window.sonoraApp.hasInfiniteTokens = profile.has_infinite_tokens;
          window.sonoraApp.updateCreditsDisplay();
        }
      }
    } catch (e) {
      console.warn('Profile load error:', e);
    }
  }

  /**
   * Saves a newly created track to Supabase
   */
  async saveTrack(track) {
    if (!this.client || !this.user) return false;
    try {
      const { error } = await this.client.from('tracks').insert([
        {
          id: track.id,
          user_id: this.user.id,
          title: track.title,
          artist: track.artist,
          prompt: track.prompt,
          style: track.style,
          category: track.category,
          lyrics: track.lyrics,
          audio_url: track.audioUrl,
          duration: track.duration,
          is_instrumental: track.isInstrumental,
          model: track.model
        }
      ]);
      return !error;
    } catch (e) {
      console.warn('Track save notice:', e);
      return false;
    }
  }

  /**
   * Fetches user's cloud tracks
   */
  async fetchUserTracks() {
    if (!this.client || !this.user) return [];
    try {
      const { data, error } = await this.client
        .from('tracks')
        .select('*')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist || 'Tú & SONORA AI',
        prompt: t.prompt,
        style: t.style,
        category: t.category,
        lyrics: t.lyrics,
        audioUrl: t.audio_url,
        duration: t.duration,
        isInstrumental: t.is_instrumental,
        model: t.model,
        isUserCreated: true
      }));
    } catch (e) {
      return [];
    }
  }
}

window.SonoraSupabaseClient = SonoraSupabaseClient;
