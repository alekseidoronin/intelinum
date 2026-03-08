import logoImg from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = { sm: 32, md: 40, lg: 56 };
  const px = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <img
        src={logoImg}
        alt="ИНТЕЛИНУМ логотип"
        width={px}
        height={px}
        className="object-contain drop-shadow-[0_0_8px_hsl(38_64%_72%/0.5)]"
      />
      {showText && (
        <span
          className="font-display gradient-text-gold tracking-widest uppercase"
          style={{ fontSize: size === "sm" ? 14 : size === "md" ? 18 : 26, letterSpacing: "0.2em" }}
        >
          ИНТЕЛИНУМ
        </span>
      )}
    </div>
  );
}
