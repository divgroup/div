import React, { useState, useEffect } from "react";
import {
  Sparkles,
  User,
  Briefcase,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Youtube,
  Link2,
  Tag,
  Palette,
  QrCode,
  Download,
  Smartphone,
  RefreshCw,
  Cpu,
  Plus,
  X,
  Compass,
  Zap,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  Info
} from "lucide-react";
import { DigitalProfile, ProfileVibe } from "./types";

const INITIAL_PROFILE: DigitalProfile = {
  fullName: "Nguyễn Minh Khang",
  jobTitle: "Trưởng phòng Thiết kế Sản phẩm",
  company: "Aether Dynamics",
  industry: "Thiết kế Không gian & AI",
  headline: "Kiến tạo giao diện người dùng không ma sát cho thế giới thực tế ảo và web thế hệ mới.",
  bio: "Hơn 8 năm kinh nghiệm dẫn dắt thiết kế, tạo hình cho các cổng thông tin thực tế ảo tăng cường (AR/VR) và phần cứng không gian trực quan. Đam mê thiết kế tương tác vi mô, cảm giác phản hồi xúc giác và bố cục thích ứng linh hoạt.",
  email: "khang.nguyen@aetherdynamics.vn",
  phone: "0912345678",
  website: "https://minhkhang.design",
  address: "Quận 1, TP. Hồ Chí Minh",
  linkedin: "https://linkedin.com/in/nguyen-minh-khang",
  twitter: "https://twitter.com/khangdesign",
  github: "https://github.com/khangnguyen-dev",
  instagram: "https://instagram.com/khangvance.studio",
  youtube: "",
  customLabel: "Đặt lịch tư vấn thiết kế 1:1",
  customUrl: "https://cal.com/minhkhang",
  tags: ["Giao diện Không gian", "Hệ thống Thiết kế", "Thực tế ảo AR/VR", "Trải nghiệm UX", "Xúc giác Haptics"],
  theme: "slate",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
  avatarPrompt: "Chân dung studio chuyên nghiệp của một nhà thiết kế sản phẩm công nghệ tương lai, ánh sáng điện ảnh ấm áp, chiều sâu trường ảnh mỏng, chi tiết cực kỳ sắc nét."
};

const THEMES: { id: string; name: string; gradient: string; accent: string; bg: string; text: string; pill: string }[] = [
  {
    id: "slate",
    name: "Đá Onyx",
    gradient: "from-slate-700 via-slate-800 to-slate-950",
    accent: "bg-slate-900 border-slate-800 hover:bg-slate-800 text-white",
    bg: "bg-slate-50",
    text: "text-slate-900",
    pill: "bg-slate-100 text-slate-700 hover:bg-slate-200"
  },
  {
    id: "emerald",
    name: "Vườn Lục Bảo",
    gradient: "from-emerald-600 via-teal-800 to-cyan-950",
    accent: "bg-emerald-600 border-emerald-500 hover:bg-emerald-700 text-white",
    bg: "bg-emerald-50/30",
    text: "text-emerald-950",
    pill: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
  },
  {
    id: "terracotta",
    name: "Đất Nung Ấm",
    gradient: "from-orange-600 via-amber-700 to-amber-950",
    accent: "bg-amber-600 border-amber-500 hover:bg-amber-700 text-white",
    bg: "bg-orange-50/30",
    text: "text-amber-950",
    pill: "bg-orange-50 text-orange-700 hover:bg-orange-100"
  },
  {
    id: "ocean",
    name: "Đại Dương Sâu",
    gradient: "from-blue-600 via-indigo-800 to-slate-950",
    accent: "bg-blue-600 border-blue-500 hover:bg-blue-700 text-white",
    bg: "bg-blue-50/30",
    text: "text-blue-950",
    pill: "bg-blue-50 text-blue-700 hover:bg-blue-100"
  },
  {
    id: "amber",
    name: "Hoang Mạc Vàng",
    gradient: "from-amber-500 via-yellow-600 to-amber-950",
    accent: "bg-yellow-600 border-yellow-500 hover:bg-yellow-700 text-white",
    bg: "bg-yellow-50/20",
    text: "text-slate-900",
    pill: "bg-yellow-50 text-amber-800 hover:bg-yellow-100/80"
  },
  {
    id: "purple",
    name: "Tinh Vân Tím",
    gradient: "from-purple-600 via-violet-800 to-indigo-950",
    accent: "bg-purple-600 border-purple-500 hover:bg-purple-700 text-white",
    bg: "bg-purple-50/30",
    text: "text-purple-950",
    pill: "bg-purple-50 text-purple-700 hover:bg-purple-100"
  }
];

export default function App() {
  const [profile, setProfile] = useState<DigitalProfile>(() => {
    const saved = localStorage.getItem("omnicard_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  // Editor states
  const [newTag, setNewTag] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<ProfileVibe>("professional");
  const [aiLoading, setAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Avatar generator states
  const [avatarPromptText, setAvatarPromptText] = useState(profile.avatarPrompt || "");
  const [imageModel, setImageModel] = useState("gemini-3-pro-image");
  const [imageSize, setImageSize] = useState("1K");
  const [imageLoading, setImageLoading] = useState(false);

  // Custom bio refinement states
  const [bioEditInstruction, setBioEditInstruction] = useState("");
  const [bioEditLoading, setBioEditLoading] = useState(false);

  // Copy status
  const [copySuccess, setCopySuccess] = useState(false);

  // NFC tap simulation animation trigger
  const [nfcTapped, setNfcTapped] = useState(false);

  // Share Modal / QR Modal trigger
  const [showQrModal, setShowQrModal] = useState(false);

  // Active interaction pop-ups in phone frame
  const [phoneDialog, setPhoneDialog] = useState<string | null>(null);

  // Save profile state to local storage when changed
  useEffect(() => {
    localStorage.setItem("omnicard_profile", JSON.stringify(profile));
  }, [profile]);

  // Sync state if profile's avatarPrompt is updated from Gemini
  useEffect(() => {
    if (profile.avatarPrompt) {
      setAvatarPromptText(profile.avatarPrompt);
    }
  }, [profile.avatarPrompt]);

  // Brainstorm / Generate Profile using Gemini
  const handleSmartGenerate = async () => {
    if (!profile.jobTitle.trim()) {
      setErrorMsg("Vui lòng nhập ít nhất chức danh công việc để kích hoạt Trợ lý thông minh Gemini.");
      return;
    }

    setAiLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: profile.jobTitle,
          company: profile.company,
          industry: profile.industry,
          vibe: selectedVibe
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể khởi tạo thông tin bằng AI.");
      }

      setProfile(prev => ({
        ...prev,
        headline: data.headline,
        bio: data.bio,
        tags: data.tags,
        theme: data.theme,
        avatarPrompt: data.avatarPrompt
      }));
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi kết nối với Trợ lý thông minh Gemini.");
    } finally {
      setAiLoading(false);
    }
  };

  // Rewrite / Refine biography using Gemini
  const handleRefineBio = async () => {
    if (!profile.bio.trim()) {
      setErrorMsg("Vui lòng viết tiểu sử ban đầu trước khi yêu cầu tinh chỉnh.");
      return;
    }
    if (!bioEditInstruction.trim()) {
      setErrorMsg("Vui lòng nhập hướng dẫn tinh chỉnh (ví dụ: 'Làm ngắn gọn hơn').");
      return;
    }

    setBioEditLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/improve-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentBio: profile.bio,
          instruction: bioEditInstruction,
          vibe: selectedVibe
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể cải thiện tiểu sử.");
      }

      setProfile(prev => ({
        ...prev,
        bio: data.improvedBio
      }));
      setBioEditInstruction("");
    } catch (err: any) {
      setErrorMsg(err.message || "Cải thiện tiểu sử thất bại.");
    } finally {
      setBioEditLoading(false);
    }
  };

  // Generate Professional Headshot Avatar
  const handleGenerateAvatar = async () => {
    if (!avatarPromptText.trim()) {
      setErrorMsg("Vui lòng nhập mô tả ảnh chân dung chân thực.");
      return;
    }

    setImageLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: avatarPromptText,
          model: imageModel,
          aspectRatio: "1:1", // Headshot is square
          size: imageSize
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo ảnh chân dung chân thực bằng AI.");
      }

      setProfile(prev => ({
        ...prev,
        avatarUrl: data.imageUrl
      }));
    } catch (err: any) {
      setErrorMsg(err.message || "Tạo ảnh chân dung bằng AI thất bại.");
    } finally {
      setImageLoading(false);
    }
  };

  // Add tag helper
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTag.trim();
    if (tag && !profile.tags.includes(tag)) {
      setProfile(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag("");
    }
  };

  // Remove tag helper
  const handleRemoveTag = (tagToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  // Dynamic vCard .vcf file compilation
  const handleDownloadVCard = () => {
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName}
TITLE:${profile.jobTitle}
ORG:${profile.company}
EMAIL;TYPE=INTERNET,PREF:${profile.email}
TEL;TYPE=CELL:${profile.phone}
URL:${profile.website}
ADR;TYPE=WORK:;;${profile.address}
NOTE:${profile.bio.replace(/\n/g, ' ')}
X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}
X-SOCIALPROFILE;TYPE=twitter:${profile.twitter}
X-SOCIALPROFILE;TYPE=github:${profile.github}
X-SOCIALPROFILE;TYPE=instagram:${profile.instagram}
END:VCARD`;

    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.fullName.toLowerCase().replace(/\s+/g, "_")}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate NFC Tap
  const triggerNfcTapSimulation = () => {
    setNfcTapped(true);
    setTimeout(() => {
      setNfcTapped(false);
    }, 3000);
  };

  // Copy simulated NFC URL
  const handleCopyLink = () => {
    const fakeUrl = window.location.href;
    navigator.clipboard.writeText(fakeUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Reset to default template
  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục dữ liệu hồ sơ chuyên nghiệp mặc định không?")) {
      setProfile(INITIAL_PROFILE);
      setAvatarPromptText(INITIAL_PROFILE.avatarPrompt || "");
    }
  };

  const activeTheme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(profile.website || window.location.href)}&color=0f172a&bgcolor=ffffff`;

  const vibeLabels: Record<ProfileVibe, string> = {
    professional: "Chuyên nghiệp",
    creative: "Sáng tạo",
    technical: "Kỹ thuật",
    warm: "Thân thiện",
    minimal: "Tối giản"
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white" id="main_container">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-4 py-4" id="app_header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20" id="header_icon">
              <Smartphone className="w-6 h-6 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">NFC Profile Studio</h1>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Phiên bản 2.1</span>
              </div>
              <p className="text-xs text-slate-400">Thiết kế danh thiếp điện tử không tiếp xúc, tạo ảnh chân dung bằng AI và xuất tệp vCard lưu danh bạ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-2 rounded-xl transition-all"
              id="reset_btn"
            >
              Khôi phục Mặc định
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/10"
              id="share_button_top"
            >
              <QrCode className="w-4 h-4" />
              Mã quét QR / NFC
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12" id="app_main">
        
        {/* Global error block */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-rose-200 text-xs flex items-start gap-3 shadow-lg animate-fadeIn" id="global_error">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-sm text-white mb-0.5">Lỗi Hệ thống Studio</span>
              <p className="leading-relaxed">{errorMsg}</p>
              {errorMsg.includes("GEMINI_API_KEY") && (
                <div className="mt-3 p-3 bg-slate-900/80 border border-rose-900/35 rounded-xl text-slate-300 space-y-2 text-[11px]">
                  <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Hướng dẫn khắc phục sự cố API Key:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                    <li>Nhấp vào biểu tượng <strong className="text-indigo-400">Settings (Cài đặt)</strong> ở thanh công cụ phía trên bên phải.</li>
                    <li>Chọn thẻ <strong className="text-indigo-400">Secrets (Bí mật)</strong> hoặc biến môi trường.</li>
                    <li>Thêm một biến mới với khóa <code className="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-400 font-mono font-bold">GEMINI_API_KEY</code>.</li>
                    <li>Dán giá trị mã khóa API Gemini của bạn vào, nhấn lưu rồi làm mới lại trang web để kích hoạt toàn bộ trí tuệ nhân tạo!</li>
                  </ol>
                </div>
              )}
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" id="studio_grid">
          
          {/* ================= LEFT COLUMN: DESIGN & EDIT ENGINE (lg:span-7) ================= */}
          <div className="lg:col-span-7 space-y-8" id="editor_workspace">
            
            {/* Panel 1: Card Base Details */}
            <section className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden" id="card_details_section">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <User className="w-32 h-32 text-indigo-500" />
              </div>

              <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                1. Thông tin Thương hiệu Cá nhân
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="identity_fields_grid">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Họ và Tên Hiển thị</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="Ví dụ: Nguyễn Minh Khang"
                      className="w-full bg-slate-900/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Chức danh / Chuyên môn</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      placeholder="Ví dụ: Trưởng phòng Thiết kế Sản phẩm"
                      className="w-full bg-slate-900/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Công ty / Tổ chức</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Ví dụ: Aether Dynamics"
                      className="w-full bg-slate-900/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Lĩnh vực hoạt động</label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                      placeholder="Ví dụ: Thiết kế Không gian & AI"
                      className="w-full bg-slate-900/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Gemini Interactive Brainstormer Card */}
              <div className="mt-6 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40" id="gemini_assistant_panel">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-xl border border-indigo-500/20">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Trợ lý Hồ sơ Thông minh Gemini
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Nhập chức danh công việc của bạn ở trên và chọn phong cách, Gemini sẽ thiết kế một câu khẩu hiệu ấn tượng, viết tiểu sử chuyên nghiệp, gợi ý nhãn kỹ năng và tạo mẫu prompt chân dung tương ứng.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Phong cách Thương hiệu</label>
                      <div className="flex flex-wrap gap-2" id="vibe_selector">
                        {(["professional", "creative", "technical", "warm", "minimal"] as ProfileVibe[]).map((v) => (
                          <button
                            key={v}
                            onClick={() => setSelectedVibe(v)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all uppercase tracking-wider ${
                              selectedVibe === v
                                ? "bg-indigo-600 border-indigo-500 text-white"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {vibeLabels[v]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSmartGenerate}
                      disabled={aiLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      id="brainstorm_btn"
                    >
                      {aiLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Gemini đang thiết kế nội dung thương hiệu...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Yêu cầu Gemini tạo Khẩu hiệu & Tiểu sử tiếng Việt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Panel 2: Detailed Copy & Headline */}
            <section className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5" id="biography_section">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-400" />
                2. Khẩu hiệu, Tiểu sử & Nhãn kỹ năng
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Câu Khẩu hiệu / Tiêu đề Cá nhân</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="Ví dụ: Thiết kế giao diện người dùng không ma sát cho thế giới thực tế ảo và web thế hệ mới."
                  className="w-full bg-slate-900/70 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                />
                <span className="text-[10px] text-slate-500 block">Mô tả cực ngắn gọn xuất hiện ngay dưới tên hiển thị của bạn (tối đa 120 ký tự).</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400">Tiểu sử Chuyên nghiệp</label>
                  <span className="text-[10px] text-slate-500">{profile.bio.length} ký tự</span>
                </div>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Mô tả năng lực cốt lõi, sứ mệnh và các thành tựu lớn của bạn..."
                  className="w-full h-28 bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none resize-none"
                />
              </div>

              {/* Gemini Bio Refiner */}
              <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-2xl space-y-3" id="bio_refiner_box">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Tinh chỉnh Tiểu sử với AI
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bioEditInstruction}
                    onChange={(e) => setBioEditInstruction(e.target.value)}
                    placeholder="Ví dụ: Viết súc tích hơn, viết theo lối kể chuyện cuốn hút..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleRefineBio}
                    disabled={bioEditLoading || !bioEditInstruction.trim()}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700 transition-all shrink-0"
                  >
                    {bioEditLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Cải thiện
                  </button>
                </div>
              </div>

              {/* Core Skill Tags */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Tag className="w-4 h-4 text-slate-400" />
                    Nhãn kỹ năng & Sở thích chuyên môn
                  </label>
                  <span className="text-[10px] text-slate-500">{profile.tags.length} nhãn đang hoạt động</span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900/40 border border-slate-800/80 rounded-xl min-h-12" id="tags_pool">
                  {profile.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium border border-slate-700"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {profile.tags.length === 0 && (
                    <span className="text-xs text-slate-500 p-1.5 italic">Chưa có nhãn kỹ năng nào. Hãy nhập thêm bên dưới!</span>
                  )}
                </div>

                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nhập nhãn kỹ năng (ví dụ: TypeScript, UI/UX) rồi nhấn nút Thêm hoặc Enter"
                    className="flex-1 bg-slate-900/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-1.5 rounded-xl text-xs text-white transition-all font-semibold"
                  >
                    Thêm
                  </button>
                </form>
              </div>
            </section>

            {/* Panel 3: Digital Contact Coordinates */}
            <section className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5" id="social_coordinates_section">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-indigo-400" />
                3. Liên kết Hành động NFC & Liên hệ
              </h2>
              <p className="text-xs text-slate-400">
                Cấu hình thông tin liên hệ trực tiếp và liên kết mạng xã hội. Các đường dẫn trống sẽ tự động được ẩn trên giao diện xem trước thiết bị di động.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="contacts_and_socials_grid">
                
                {/* Email */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3 text-red-400" /> Email Liên hệ
                  </span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Ví dụ: khang.nguyen@aetherdynamics.vn"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" /> Số Điện thoại
                  </span>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Website */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-400" /> Trang web Cá nhân
                  </span>
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="Ví dụ: https://minhkhang.design"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-400" /> Địa chỉ Văn phòng
                  </span>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-blue-500" /> Đường dẫn LinkedIn
                  </span>
                  <input
                    type="text"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/ten-nguoi-dung"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Twitter/X */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Twitter className="w-3 h-3 text-slate-300" /> Đường dẫn Twitter/X
                  </span>
                  <input
                    type="text"
                    value={profile.twitter}
                    onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                    placeholder="https://twitter.com/ten-nguoi-dung"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* GitHub */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Github className="w-3 h-3 text-purple-400" /> Đường dẫn GitHub
                  </span>
                  <input
                    type="text"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="https://github.com/ten-nguoi-dung"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Instagram className="w-3 h-3 text-pink-500" /> Đường dẫn Instagram
                  </span>
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    placeholder="https://instagram.com/ten-nguoi-dung"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Custom High-Priority Call to Action Button Link */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Nút Kêu gọi Hành động Nổi bật (Pulsating CTA)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">Nhãn nút bấm</span>
                    <input
                      type="text"
                      value={profile.customLabel}
                      onChange={(e) => setProfile({ ...profile, customLabel: e.target.value })}
                      placeholder="Ví dụ: Đặt lịch tư vấn 1:1"
                      className="w-full bg-slate-900/40 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">Đường dẫn liên kết (Target URL)</span>
                    <input
                      type="text"
                      value={profile.customUrl}
                      onChange={(e) => setProfile({ ...profile, customUrl: e.target.value })}
                      placeholder="Ví dụ: https://calendly.com/ten-nguoi-dung"
                      className="w-full bg-slate-900/40 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Panel 4: AI Portrait Studio */}
            <section className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5" id="avatar_generator_section">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  4. Công cụ Tạo Chân dung Chuyên nghiệp với AI
                </h2>
                <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full uppercase">Ảnh vuông 1:1</span>
              </div>

              <p className="text-xs text-slate-400">
                Phác họa một bức ảnh chân dung tuyệt đẹp phù hợp với ngành nghề và phong cách của bạn. Bạn có thể tự do chỉnh sửa văn bản mô tả chi tiết bằng tiếng Việt hoặc tiếng Anh, sau đó nhấn nút khởi tạo ảnh từ mô hình Imagen.
              </p>

              <div className="space-y-2">
                <textarea
                  value={avatarPromptText}
                  onChange={(e) => setAvatarPromptText(e.target.value)}
                  placeholder="Ví dụ: Chân dung chân thực chụp trong studio chuyên nghiệp, trang phục lịch sự, ánh sáng ấm áp, hậu cảnh văn phòng sang trọng tối giản..."
                  className="w-full h-20 bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none resize-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Mô hình Tạo ảnh</span>
                  <select
                    value={imageModel}
                    onChange={(e) => setImageModel(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs"
                  >
                    <option value="gemini-3-pro-image">Chất lượng Studio Cao cấp (Imagen 3 Pro)</option>
                    <option value="gemini-3.1-flash-image">Tạo nhanh Nghệ thuật (Imagen 3.1 Flash)</option>
                    <option value="gemini-3.1-flash-lite-image">Tiêu chuẩn Tiết kiệm (Imagen 3.1 Lite)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Độ phân giải Ảnh</span>
                  <select
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    disabled={imageModel === "gemini-3.1-flash-lite-image"}
                    className="w-full p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs disabled:opacity-50"
                  >
                    <option value="512px">Web Siêu nhanh (512px)</option>
                    <option value="1K">Độ nét cao HD (1K)</option>
                    <option value="2K">Siêu nét Retina (2K)</option>
                    <option value="4K">Độ nét in ấn Studio (4K)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAvatar}
                disabled={imageLoading || !avatarPromptText.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950"
              >
                {imageLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Hệ thống đang xử lý và tạo ảnh chân dung AI...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Khởi tạo Ảnh chân dung Chuyên nghiệp AI</span>
                  </>
                )}
              </button>
            </section>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE PHONE FRAME & SHARING (lg:span-5) ================= */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-8" id="simulator_workspace">
            
            {/* Theme Picker Widget */}
            <div className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-3xl w-full" id="theme_picker_panel">
              <span className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-wider">Bảng màu Giao diện Danh thiếp</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" id="themes_grid_selector">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setProfile({ ...profile, theme: theme.id })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      profile.theme === theme.id
                        ? "bg-slate-800 border-indigo-500 text-white shadow-lg"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${theme.gradient} border border-white/20`} />
                    <span className="text-[10px] font-semibold tracking-tight">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Mobile Device Frame */}
            <div className="relative w-full max-w-[340px]" id="smartphone_view_wrapper">
              
              {/* Phone Speaker & Notch overlay */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
                <div className="w-2.5 h-2.5 bg-slate-950 rounded-full ml-2 mb-1 border border-slate-800" />
              </div>

              {/* Physical phone border casing */}
              <div className="relative rounded-[48px] bg-slate-950 border-8 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden w-full aspect-[9/18.5] flex flex-col z-10" id="mock_phone">
                
                {/* Simulated tap signal wave (NFC simulation) */}
                {nfcTapped && (
                  <div className="absolute inset-0 z-30 bg-indigo-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn" id="nfc_overlay">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full border border-indigo-500/30 animate-ping absolute" />
                      <div className="w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500">
                        <Zap className="w-10 h-10 animate-bounce" />
                      </div>
                    </div>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-wide">
                      Đã phát sóng NFC
                    </span>
                    <h4 className="text-base font-bold text-white mt-3">Chia sẻ Thông tin Thành công</h4>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
                      Tín hiệu NFC không tiếp xúc đã được mô phỏng truyền đi thành công. Thiết bị gần đó có thể nhận thông tin tức thì!
                    </p>
                    <button
                      onClick={() => setNfcTapped(false)}
                      className="mt-6 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg font-bold text-white"
                    >
                      Đóng giả lập NFC
                    </button>
                  </div>
                )}

                {/* Simulated UI Pop-up dialogs inside phone */}
                {phoneDialog && (
                  <div className="absolute inset-x-4 bottom-6 z-20 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl animate-slideUp text-center" id="phone_dialog">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Kết nối Trực tiếp</span>
                      <button onClick={() => setPhoneDialog(null)} className="text-slate-500 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="py-2">
                      {phoneDialog === "email" && (
                        <>
                          <Mail className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                          <h5 className="text-xs font-bold text-white">Đang mở ứng dụng Thư</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{profile.email}</p>
                          <a
                            href={`mailto:${profile.email}`}
                            className="inline-block mt-3 px-4 py-1 bg-indigo-600 text-[11px] font-bold rounded-lg text-white hover:bg-indigo-700"
                          >
                            Soạn thư ngay
                          </a>
                        </>
                      )}
                      {phoneDialog === "phone" && (
                        <>
                          <Phone className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                          <h5 className="text-xs font-bold text-white">Kết nối cuộc gọi</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{profile.phone}</p>
                          <a
                            href={`tel:${profile.phone}`}
                            className="inline-block mt-3 px-4 py-1 bg-emerald-600 text-[11px] font-bold rounded-lg text-white hover:bg-emerald-700"
                          >
                            Gọi điện ngay
                          </a>
                        </>
                      )}
                      {phoneDialog === "address" && (
                        <>
                          <MapPin className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <h5 className="text-xs font-bold text-white">Xem bản đồ văn phòng</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{profile.address}</p>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(profile.address)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-3 px-4 py-1 bg-orange-600 text-[11px] font-bold rounded-lg text-white hover:bg-orange-700"
                          >
                            Chỉ đường đi
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Simulated Screen Inner Content */}
                <div className="flex-1 overflow-y-auto bg-slate-950 flex flex-col scrollbar-none pb-8" id="phone_screen">
                  
                  {/* Theme Gradient Header Banner */}
                  <div className={`h-28 bg-gradient-to-tr ${activeTheme.gradient} shrink-0 relative`} id="screen_banner">
                    <div className="absolute top-8 left-4 right-4 flex justify-between text-white/40 text-[10px] font-mono">
                      <span>VinaPhone 5G</span>
                      <span>10:42 AM</span>
                      <span>98%</span>
                    </div>
                  </div>

                  {/* Body Content with Overlapping circular Avatar */}
                  <div className="px-4 -mt-10 relative z-10 flex flex-col items-center text-center flex-1">
                    
                    {/* Circle Avatar */}
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full p-1 bg-gradient-to-tr ${activeTheme.gradient} shadow-lg shadow-black/40`}>
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt="Ảnh đại diện"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full border-2 border-slate-950"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 rounded-full border-2 border-slate-950 flex items-center justify-center">
                            <User className="w-8 h-8 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="NFC Signal Live">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Personal Coordinates Label */}
                    <div className="mt-3.5 space-y-1">
                      <h3 className="text-base font-bold text-white tracking-tight" id="phone_preview_name">{profile.fullName || "Tên của bạn"}</h3>
                      <div className="text-xs text-slate-400 font-medium">
                        {profile.jobTitle || "Chức vụ của bạn"} 
                        {profile.company && <span className="text-indigo-400"> • {profile.company}</span>}
                      </div>
                    </div>

                    {/* High-Impact Tagline */}
                    {profile.headline && (
                      <p className="mt-4 px-2 py-2 text-xs bg-slate-900/60 text-slate-300 font-medium rounded-xl leading-relaxed italic" id="phone_preview_headline">
                        "{profile.headline}"
                      </p>
                    )}

                    {/* Dynamic Skill Tags */}
                    {profile.tags.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-4" id="phone_preview_tags">
                        {profile.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${activeTheme.pill}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bio Block */}
                    {profile.bio && (
                      <div className="mt-5 text-left border-t border-slate-900 pt-4 w-full">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Giới thiệu bản thân</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">
                          {profile.bio}
                        </p>
                      </div>
                    )}

                    {/* Contact Actions Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-5 w-full" id="phone_action_buttons">
                      {profile.email && (
                        <button
                          onClick={() => setPhoneDialog("email")}
                          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 p-2 rounded-xl flex flex-col items-center justify-center gap-1 group transition-colors"
                        >
                          <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                          <span className="text-[9px] font-bold text-slate-400">Email</span>
                        </button>
                      )}
                      {profile.phone && (
                        <button
                          onClick={() => setPhoneDialog("phone")}
                          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 p-2 rounded-xl flex flex-col items-center justify-center gap-1 group transition-colors"
                        >
                          <Phone className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                          <span className="text-[9px] font-bold text-slate-400">Gọi điện</span>
                        </button>
                      )}
                      {profile.address && (
                        <button
                          onClick={() => setPhoneDialog("address")}
                          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 p-2 rounded-xl flex flex-col items-center justify-center gap-1 group transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
                          <span className="text-[9px] font-bold text-slate-400">Văn phòng</span>
                        </button>
                      )}
                    </div>

                    {/* Social coordinates list */}
                    <div className="mt-6 w-full border-t border-slate-900 pt-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-left mb-2">Kết nối mạng xã hội</span>
                      
                      <div className="flex justify-center gap-2" id="phone_preview_socials">
                        {profile.linkedin && (
                          <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/10 p-2 rounded-full transition-all"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {profile.twitter && (
                          <a
                            href={profile.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-2 rounded-full transition-all"
                            title="Twitter/X Profile"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {profile.github && (
                          <a
                            href={profile.github}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/10 p-2 rounded-full transition-all"
                            title="GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {profile.instagram && (
                          <a
                            href={profile.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 border border-pink-500/10 p-2 rounded-full transition-all"
                            title="Instagram Studio"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {profile.youtube && (
                          <a
                            href={profile.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/10 p-2 rounded-full transition-all"
                            title="YouTube Channel"
                          >
                            <Youtube className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Premium Pulsating Call-To-Action Button */}
                    {profile.customLabel && profile.customUrl && (
                      <div className="mt-6 w-full shrink-0">
                        <a
                          href={profile.customUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 group relative overflow-hidden animate-pulse"
                        >
                          <Link2 className="w-4 h-4" />
                          <span>{profile.customLabel}</span>
                          <span className="absolute top-0 left-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct sharing & physical contactless download utilities */}
            <div className="bg-slate-950/40 border border-slate-800/80 p-6 rounded-3xl w-full space-y-4 shadow-xl" id="sharing_controls">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-400" />
                Xuất thông tin số NFC & QR
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thẻ NFC vật lý thường điều hướng đến một đường dẫn số. Bạn có thể sao chép liên kết điều hướng hoặc tải trực tiếp tệp liên hệ vCard tiêu chuẩn để người dùng lưu trực tiếp vào danh bạ điện thoại.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="sharing_buttons_grid">
                
                {/* Save Contact vCard */}
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  id="vcard_download_btn"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Xuất & Lưu tệp vCard (.vcf)
                </button>

                {/* Simulated NFC Tap */}
                <button
                  type="button"
                  onClick={triggerNfcTapSimulation}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/10"
                  id="nfc_wave_trigger_btn"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  Mô phỏng Chạm Thẻ NFC
                </button>
              </div>

              {/* Copiable simulated profile deep link */}
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between" id="copiable_link_box">
                <div className="overflow-hidden mr-3">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Liên kết điều hướng NFC</span>
                  <span className="text-xs text-slate-300 truncate block font-mono mt-0.5">{profile.website || window.location.href}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    copySuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  id="copy_profile_link_btn"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* QR MODAL DIALOG OVERLAY */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" id="qr_modal_backdrop">
          <div className="bg-white text-slate-900 p-8 rounded-3xl max-w-sm w-full text-center relative shadow-2xl space-y-6" id="qr_modal_card">
            
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
              title="Đóng cửa sổ"
              id="close_qr_modal_btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">Mã QR Quét & Lưu Danh bạ</h4>
              <p className="text-xs text-slate-500">Sử dụng camera điện thoại quét mã QR bên dưới để lưu hồ sơ kỹ thuật số của {profile.fullName} trực tiếp vào danh bạ.</p>
            </div>

            {/* QR Code Canvas */}
            <div className="bg-slate-100 p-4 rounded-2xl inline-block mx-auto shadow-inner border border-slate-200">
              <img
                src={qrUrl}
                alt="NFC Profile Redirect QR Code"
                className="w-48 h-48 mx-auto rounded-lg"
              />
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-150">
              📍 <strong>Đường dẫn điều hướng NFC:</strong> <span className="font-mono text-slate-700">{profile.website || window.location.href}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Đóng lại
              </button>
              <button
                onClick={handleDownloadVCard}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Tải vCard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4" id="app_footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-600" />
            <span>© 2026 NFC Profile Studio. Được hỗ trợ bởi giải pháp trí tuệ nhân tạo Gemini.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Chính sách Bảo mật</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Điều khoản Dịch vụ</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer flex items-center gap-1">
              Tiêu chuẩn vCard v3.0 <Info className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
