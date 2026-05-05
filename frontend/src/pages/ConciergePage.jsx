import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, RefreshCw } from "lucide-react";
import axios from "axios";

const BG_IMAGE =
  "https://customer-assets.emergentagent.com/job_luxe-design-studio-2/artifacts/prqxmpyt_b354_ho_00_p_1024x768.jpg";
const BACKEND_BASE_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");
const API = `${BACKEND_BASE_URL}/api`;

const CONCIERGE_SERVICES = [
  {
    id: "butler",
    title: "Butler Services",
    tagline: "Effortless Luxury, Personally Delivered",
    description:
      "Your dedicated Fairmont Gold Butler anticipates every wish, curating bespoke experiences tailored to your vision.",
    promptSuffix:
      "In the same elegantly decorated event venue with the same colour palette and décor, show a white-gloved Fairmont Gold butler in formal attire providing personalised service to a distinguished guest at a beautifully set table. The original event décor — florals, lighting, stage — remains prominently visible in the background. Luxury hotel event photography, photorealistic, warm golden lighting, wide angle.",
  },
  {
    id: "dining",
    title: "Culinary Excellence",
    tagline: "Every Course, a Masterpiece",
    description:
      "Savor a symphony of flavours crafted by world-class chefs, served amid the grandeur of your bespoke décor.",
    promptSuffix:
      "In the same decorated event venue with identical floral arrangements and lighting theme, show an exquisite fine-dining setup where a Fairmont Gold chef presents a signature dish at an elegantly set table adorned with crystal glassware, silver cutlery, and candles. The original event décor is fully visible in the background. Luxury culinary photography, photorealistic, warm ambient glow.",
  },
  {
    id: "spa",
    title: "Spa & Serenity",
    tagline: "Restore. Renew. Reimagine.",
    description:
      "Step into a sanctuary of tranquility where our Gold Spa experience mirrors the elegance of your surroundings.",
    promptSuffix:
      "Inspired by the same luxurious ambiance, colour palette, and floral motifs of the event venue, show a serene Fairmont Gold spa suite with plush robes, candles, botanical wellness amenities, and soft lighting that echoes the event's decorative theme. High-end spa photography, photorealistic, warm ethereal glow.",
  },
  {
    id: "events",
    title: "Bespoke Event Curation",
    tagline: "Where Vision Becomes Unforgettable",
    description:
      "Our concierge orchestrates every detail — from personalised menus to floral artistry — making your celebration truly one of a kind.",
    promptSuffix:
      "In the same event venue with the same décor, lighting, and floral theme, show a Fairmont concierge in formal attire presenting a custom event proposal to guests at an elegantly arranged consultation table with personalised menus, flower samples, and ambient accent lighting. The full event venue décor remains visible in the background. Luxury event photography, photorealistic, wide shot.",
  },
];

function ServiceCard({ service, sourceImage, sourcePrompt }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async () => {
    if (!sourceImage) return;
    setLoading(true);
    setError(null);
    try {
      const basePrompt = sourcePrompt
        ? `${sourcePrompt}. ${service.promptSuffix}`
        : service.promptSuffix;

      const payload = {
        prompt: basePrompt,
        function_type: null,
        space: null,
        venue_image: sourceImage,
        design_image: null,
        venue_image_url: null,
        design_image_url: null,
        reference_image: null,
        high_quality: false,
        variant_count: 1,
      };

      const res = await axios.post(`${API}/generate`, payload);
      if (!res.data.success) {
        throw new Error(res.data.error || "Generation failed");
      }

      const imgData =
        res.data.image_data ||
        (Array.isArray(res.data.variants) &&
          res.data.variants[0] &&
          res.data.variants[0].image_data) ||
        null;

      if (!imgData) throw new Error("No image returned");
      setImage(imgData);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  }, [sourceImage, sourcePrompt, service.promptSuffix]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div
      className="glass-panel rounded-2xl overflow-hidden flex flex-col"
      data-testid={`concierge-card-${service.id}`}
    >
      {/* Image area */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black/20 min-h-[200px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3 p-6">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white/60 animate-spin" strokeWidth={1.5} />
            </div>
            <p
              className="text-white/40 text-xs tracking-wide text-center"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Crafting your experience…
            </p>
          </div>
        ) : image ? (
          <img
            src={`data:image/png;base64,${image}`}
            alt={service.title}
            className="w-full h-full object-cover max-h-60"
            data-testid={`concierge-image-${service.id}`}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 p-6">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white/30" strokeWidth={1} />
            </div>
            {error && (
              <>
                <p
                  className="text-white/40 text-xs text-center px-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {error}
                </p>
                <button
                  onClick={generate}
                  className="glass-button rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs"
                  style={{ fontFamily: "var(--font-body)" }}
                  data-testid={`retry-concierge-${service.id}`}
                >
                  <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
                  Retry
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Text area */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h3
          className="text-white/90 text-base mb-0.5"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
        >
          {service.title}
        </h3>
        <p
          className="text-white/60 text-xs uppercase tracking-widest mb-2"
          style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
        >
          {service.tagline}
        </p>
        <p
          className="text-white/40 text-xs leading-relaxed"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
        >
          {service.description}
        </p>
      </div>
    </div>
  );
}

export default function ConciergePage() {
  const navigate = useNavigate();
  const [sourceImage, setSourceImage] = useState(null);
  const [sourcePrompt, setSourcePrompt] = useState(null);
  const [hasSource, setHasSource] = useState(false);

  useEffect(() => {
    const img = sessionStorage.getItem("concierge_source_image");
    const prompt = sessionStorage.getItem("concierge_source_prompt");
    if (img) {
      setSourceImage(img);
      setHasSource(true);
    }
    if (prompt) {
      setSourcePrompt(prompt);
    }
  }, []);

  return (
    <div
      className="relative min-h-screen text-white"
      data-testid="concierge-page"
    >
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(24px) saturate(1.2)",
            WebkitBackdropFilter: "blur(24px) saturate(1.2)",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 md:px-8 py-6">
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl mb-8"
          style={{
            backdropFilter: "blur(20px) saturate(1.3)",
            WebkitBackdropFilter: "blur(20px) saturate(1.3)",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          }}
          data-testid="concierge-topbar"
        >
          <button
            onClick={() => navigate("/studio")}
            className="glass-button rounded-full px-4 py-2 flex items-center gap-2 text-sm"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
            data-testid="back-to-studio"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Back to Studio</span>
          </button>

          <div className="text-center">
            <h1
              className="text-xl md:text-2xl text-white/90"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              Fairmont Gold Concierge
            </h1>
            <p
              className="text-white/40 text-xs tracking-widest uppercase hidden sm:block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Curated Exclusively for You
            </p>
          </div>

          <div className="w-28" />
        </div>

        {/* Header tagline */}
        <div className="text-center mb-8">
          <p
            className="text-white/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            {hasSource
              ? "Discover our signature Gold services, artfully imagined within the ambiance of your bespoke design."
              : "Generate a venue design in the Studio first, then return here to unlock personalised concierge experiences."}
          </p>
        </div>

        {hasSource ? (
          /* 2×2 Grid of service cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {CONCIERGE_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                sourceImage={sourceImage}
                sourcePrompt={sourcePrompt}
              />
            ))}
          </div>
        ) : (
          /* No source image — prompt user */
          <div className="flex-1 flex items-center justify-center">
            <div className="glass-panel rounded-2xl p-10 text-center max-w-md">
              <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-white/30" strokeWidth={1} />
              </div>
              <h2
                className="text-white/80 text-lg mb-3"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}
              >
                No Design Found
              </h2>
              <p
                className="text-white/40 text-sm mb-6 leading-relaxed"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                Head back to the Design Studio, generate your venue vision, and
                then click the Concierge button to unlock your personalised
                Gold services.
              </p>
              <button
                onClick={() => navigate("/studio")}
                className="glass-button rounded-full px-6 py-3 text-sm uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
                data-testid="go-to-studio"
              >
                Open Design Studio
              </button>
            </div>
          </div>
        )}

        {/* Footer branding */}
        <div className="mt-10 text-center">
          <p
            className="text-white/20 text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Fairmont Gold · The Art of Extraordinary
          </p>
        </div>
      </div>
    </div>
  );
}
