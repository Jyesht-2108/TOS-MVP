import { DollarSign, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { motion } from 'framer-motion';

export default function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Finance Dashboard 💰</h1>
        <p className="text-primary-foreground/90 text-lg">
          Manage invoices and track payments
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value="₹2.5L"
          icon={DollarSign}
          variant="success"
          trend="+15% this month"
          delay={0.1}
        />
        <StatsCard
          title="Pending Invoices"
          value="45"
          icon={FileText}
          variant="warning"
          subtitle="₹1.2L pending"
          delay={0.15}
        />
        <StatsCard
          title="Collected Today"
          value="₹45,000"
          icon={TrendingUp}
          variant="primary"
          trend="12 payments"
          delay={0.2}
        />
        <StatsCard
          title="Overdue"
          value="8"
          icon={AlertCircle}
          variant="default"
          subtitle="₹80,000"
          delay={0.25}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {[
              { student: 'John Doe', amount: '₹15,000', time: '2 hours ago', status: 'success' },
              { student: 'Mary Jane', amount: '₹12,000', time: '3 hours ago', status: 'success' },
              { student: 'Bob Smith', amount: '₹18,000', time: '5 hours ago', status: 'success' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.student}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <span className="text-sm font-semibold text-success">{item.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction title="Create Invoice" subtitle="Generate new invoice" />
            <QuickAction title="Record Payment" subtitle="Manual payment entry" />
            <QuickAction title="Send Reminder" subtitle="Payment reminders" />
            <QuickAction title="View Reports" subtitle="Financial reports" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function QuickAction({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-start gap-1 p-3 rounded-lg border border-border hover:border-primary/30 transition-all text-left"
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </motion.button>
  );
}
