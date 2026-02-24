import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { forwardRef, ReactNode } from 'react';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  hover?: boolean;
  children?: ReactNode;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, delay = 0, hover = true, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay,
          ease: 'easeOut',
        }}
        whileHover={
          hover
            ? {
                y: -4,
                transition: { duration: 0.2 },
              }
            : undefined
        }
      >
        <Card ref={ref} className={className} {...props}>
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
