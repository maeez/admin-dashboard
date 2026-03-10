import { useState } from "react";
import "./settings.scss";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
};

type Prefs = {
  language: string;
  timezone: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactor: boolean;
  autoLogout: boolean;
};

type ProfileErrors = Partial<Record<keyof Omit<Profile, "role">, string>>;

const defaultPrefs: Prefs = {
  language: "English",
  timezone: "UTC+00:00",
  currency: "USD",
  emailNotifications: true,
  pushNotifications: false,
  twoFactor: false,
  autoLogout: true,
};

const validateProfile = (profile: Profile): ProfileErrors => {
  const errors: ProfileErrors = {};

  if (!profile.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (!/^[a-zA-Z\s]+$/.test(profile.fullName.trim())) {
    errors.fullName = "Only alphabets are allowed.";
  }

  if (!profile.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!profile.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(profile.phone.trim())) {
    errors.phone = "Phone must be exactly 10 digits.";
  }

  if (!profile.bio.trim()) {
    errors.bio = "Bio is required.";
  }

  return errors;
};

const Settings = () => {
  const [profileSaved, setProfileSaved] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [prefsReset, setPrefsReset] = useState(false);
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});

  const [profile, setProfile] = useState<Profile>({
    fullName: "Jane Admin",
    email: "jane@admin.com",
    phone: "9876543210",
    role: "Administrator",
    bio: "System administrator with full dashboard access.",
  });

  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setProfileSaved(false);
    if (profileErrors[name as keyof ProfileErrors]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePrefChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setPrefs((prev) => ({ ...prev, [target.name]: value }));
    setPrefsSaved(false);
    setPrefsReset(false);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateProfile(profile);
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    setProfileErrors({});
    setProfileSaved(true);
  };

  const handlePrefsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsSaved(true);
    setPrefsReset(false);
  };

  const handleResetPrefs = () => {
    if (window.confirm("Reset all system preferences to their default values?")) {
      setPrefs(defaultPrefs);
      setPrefsSaved(false);
      setPrefsReset(true);
    }
  };

  return (
    <div className="settings">
      <div className="settingsHeader">
        <h1>Settings</h1>
        <span className="subtitle">Manage your profile and system preferences</span>
      </div>

      <div className="settingsGrid">
        <div className="settingsCard">
          <h2>Profile Details</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="formGrid">
              <div className="item">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  placeholder="Full Name"
                />
                {profileErrors.fullName && <span className="fieldError">{profileErrors.fullName}</span>}
              </div>

              <div className="item">
                <label>Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                />
                {profileErrors.email && <span className="fieldError">{profileErrors.email}</span>}
              </div>

              <div className="item">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Phone"
                  maxLength={10}
                  onKeyPress={(e) => {
                    if (!/\d/.test(e.key)) e.preventDefault();
                  }}
                />
                {profileErrors.phone && <span className="fieldError">{profileErrors.phone}</span>}
              </div>

              <div className="item">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={profile.role}
                  placeholder="Role"
                  readOnly
                  className="readOnly"
                />
              </div>

              <div className="item full-width">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Short bio..."
                  rows={3}
                />
                {profileErrors.bio && <span className="fieldError">{profileErrors.bio}</span>}
              </div>
            </div>

            <div className="formFooter">
              {profileSaved && <span className="savedMsg">✓ Profile saved successfully</span>}
              <button type="submit">Save Profile</button>
            </div>
          </form>
        </div>

        <div className="settingsCard">
          <h2>System Preferences</h2>
          <form onSubmit={handlePrefsSubmit}>
            <div className="formGrid">
              <div className="item">
                <label>Language</label>
                <select name="language" value={prefs.language} onChange={handlePrefChange}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
              <div className="item">
                <label>Timezone</label>
                <select name="timezone" value={prefs.timezone} onChange={handlePrefChange}>
                  <option>UTC+00:00</option>
                  <option>UTC+05:30</option>
                  <option>UTC-05:00</option>
                  <option>UTC-08:00</option>
                  <option>UTC+09:00</option>
                </select>
              </div>
              <div className="item">
                <label>Currency</label>
                <select name="currency" value={prefs.currency} onChange={handlePrefChange}>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JPY</option>
                  <option>INR</option>
                </select>
              </div>
            </div>

            <div className="toggleSection">
              <h3>Notifications &amp; Security</h3>
              <div className="toggleRow">
                <div className="toggleInfo">
                  <span className="toggleLabel">Email Notifications</span>
                  <span className="toggleDesc">Receive updates and alerts via email</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" name="emailNotifications" checked={prefs.emailNotifications} onChange={handlePrefChange} />
                  <span className="slider" />
                </label>
              </div>
              <div className="toggleRow">
                <div className="toggleInfo">
                  <span className="toggleLabel">Push Notifications</span>
                  <span className="toggleDesc">Browser push alerts for real-time events</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" name="pushNotifications" checked={prefs.pushNotifications} onChange={handlePrefChange} />
                  <span className="slider" />
                </label>
              </div>
              <div className="toggleRow">
                <div className="toggleInfo">
                  <span className="toggleLabel">Two-Factor Authentication</span>
                  <span className="toggleDesc">Add an extra layer of account security</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" name="twoFactor" checked={prefs.twoFactor} onChange={handlePrefChange} />
                  <span className="slider" />
                </label>
              </div>
              <div className="toggleRow">
                <div className="toggleInfo">
                  <span className="toggleLabel">Auto Logout</span>
                  <span className="toggleDesc">Automatically log out after 30 minutes of inactivity</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" name="autoLogout" checked={prefs.autoLogout} onChange={handlePrefChange} />
                  <span className="slider" />
                </label>
              </div>
            </div>

            <div className="formFooter">
              {prefsSaved && <span className="savedMsg">✓ Preferences saved successfully</span>}
              {prefsReset && <span className="savedMsg">✓ Preferences reset to defaults</span>}
              <button type="submit">Save Preferences</button>
            </div>
          </form>
        </div>

        <div className="settingsCard dangerCard">
          <h2>Danger Zone</h2>
          <div className="dangerRow">
            <div>
              <span className="dangerLabel">Reset System Preferences</span>
              <span className="dangerDesc">Revert all system preferences to their default values. Profile details will not be affected.</span>
            </div>
            <button type="button" className="dangerBtn" onClick={handleResetPrefs}>
              Reset Defaults
            </button>
          </div>
          <div className="dangerRow">
            <div>
              <span className="dangerLabel">Delete Account</span>
              <span className="dangerDesc">Permanently delete your account and all associated data.</span>
            </div>
            <button type="button" className="dangerBtn" onClick={() => window.confirm("Are you sure? This cannot be undone.")}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;