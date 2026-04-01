import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useState, useCallback, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({ children, className, staggerDelay = 0.06 }: StaggerProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: staggerDelay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }: Props) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, className }: Props) => (
  <motion.div
    initial={{ scale: 0.92, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

interface CardProps extends Props {
  delay?: number;
}

export const AnimatedCard = ({ children, className, delay = 0 }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    whileTap={{ scale: 0.98 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PressableCard = ({ children, className }: Props) => (
  <motion.div
    whileTap={{ scale: 0.97 }}
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ──── Swipeable Card ──── */
interface SwipeableCardProps extends Props {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftLabel?: string;
  rightLabel?: string;
}

export const SwipeableCard = ({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = "Dismiss",
  rightLabel = "Action",
}: SwipeableCardProps) => {
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [-120, 0, 120], [1, 0, 1]);
  const bgColor = useTransform(x, (val) =>
    val < 0
      ? `hsla(0, 72%, 51%, ${Math.min(Math.abs(val) / 120, 0.15)})`
      : `hsla(150, 50%, 12%, ${Math.min(val / 120, 0.15)})`
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 && onSwipeLeft) onSwipeLeft();
    if (info.offset.x > 80 && onSwipeRight) onSwipeRight();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background action labels */}
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="absolute inset-0 rounded-2xl flex items-center justify-between px-5"
      >
        <motion.span
          style={{ opacity: useTransform(x, [40, 100], [0, 1]) }}
          className="label-sm text-primary font-bold"
        >
          {rightLabel}
        </motion.span>
        <motion.span
          style={{ opacity: useTransform(x, [-100, -40], [1, 0]) }}
          className="label-sm text-destructive font-bold"
        >
          {leftLabel}
        </motion.span>
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        style={{ x }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ──── Pull to Refresh ──── */
interface PullToRefreshProps extends Props {
  onRefresh?: () => void | Promise<void>;
}

export const PullToRefresh = ({ children, className, onRefresh }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const pullProgress = useTransform(y, [0, 80], [0, 1]);
  const spinRotation = useTransform(y, [0, 80], [0, 360]);

  const handleDragEnd = useCallback(
    async (_: unknown, info: PanInfo) => {
      if (info.offset.y > 70 && onRefresh && !isRefreshing) {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 600);
      }
    },
    [onRefresh, isRefreshing]
  );

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {/* Pull indicator */}
      <motion.div
        style={{ opacity: pullProgress, y: useTransform(y, [0, 80], [-40, 0]) }}
        className="absolute top-0 left-0 right-0 flex justify-center py-3 z-10"
      >
        <motion.div
          style={{ rotate: isRefreshing ? undefined : spinRotation }}
          animate={isRefreshing ? { rotate: 360 } : undefined}
          transition={isRefreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : undefined}
          className="w-8 h-8 rounded-full pull-indicator flex items-center justify-center shadow-btn"
        >
          <RefreshCw size={14} className="text-foreground" />
        </motion.div>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        style={{ y }}
        onDragEnd={handleDragEnd}
        dragDirectionLock
      >
        {children}
      </motion.div>
    </div>
  );
};
