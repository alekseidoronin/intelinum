import logoImg from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  vertical?: boolean;
}

export function Logo({ size = "md", showText = true, vertical = true }: LogoProps) {
  const sizes = { sm: 42, md: 40, lg: 72 };
  const px = sizes[size];
  const textSizes = { sm: 17, md: 18, lg: 26 };

  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-3 my-[10px] pt-0">
        <img
          src={logoImg}
          alt="ИНТЕЛИНУМ логотип"
          width={px}
          height={px}
          className="object-contain" />
        
        {showText &&
        <span
          className="font-display text-royal tracking-widest uppercase font-semibold"
          style={{ fontSize: textSizes[size], letterSpacing: "0.18em" }}>
          
            ИНТЕЛИНУМ
          </span>
        }
      </div>);

  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={logoImg}
        alt="ИНТЕЛИНУМ логотип"
        width={px}
        height={px}
        className="object-contain" />
      
      {showText &&
      <span
        className="font-display text-royal tracking-widest uppercase font-semibold"
        style={{ fontSize: textSizes[size], letterSpacing: "0.18em" }}>
        
          ИНТЕЛИНУМ
        </span>
      }
    </div>);

}