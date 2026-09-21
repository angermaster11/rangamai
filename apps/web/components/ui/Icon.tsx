import {
  Bot,
  BrainCircuit,
  Globe,
  Smartphone,
  Cog,
  ShieldCheck,
  Sparkles,
  Layers,
  Gauge,
  Search,
  PenLine,
  Hammer,
  FlaskConical,
  Rocket,
  LifeBuoy,
  ArrowRight,
  Check,
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Linkedin,
  ExternalLink,
  Github,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the icon-name strings stored in content (seed / future CMS) to
 * lucide-react components. Using SVG icons only — no emoji (pre-delivery rule).
 * Unknown names fall back to a neutral icon so the UI never breaks.
 */
const registry: Record<string, LucideIcon> = {
  Bot,
  BrainCircuit,
  Globe,
  Smartphone,
  Cog,
  ShieldCheck,
  Sparkles,
  Layers,
  Gauge,
  Search,
  PenLine,
  Hammer,
  FlaskConical,
  Rocket,
  LifeBuoy,
  ArrowRight,
  Check,
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Linkedin,
  ExternalLink,
  Github,
};

export function Icon({
  name,
  className,
  "aria-hidden": ariaHidden = true,
  ...rest
}: {
  name?: string;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  const Cmp = (name && registry[name]) || Sparkles;
  return <Cmp className={className} aria-hidden={ariaHidden} {...rest} />;
}
