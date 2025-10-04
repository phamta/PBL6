import { ChevronRight, Home } from "lucide-react";
import { motion } from "motion/react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <Home className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Trang chủ</span>
      </motion.div>

      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span
            className={
              index === items.length - 1
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }
          >
            {item.label}
          </span>
        </motion.div>
      ))}
    </nav>
  );
}
