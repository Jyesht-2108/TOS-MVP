import { ClipboardCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { motion } from 'framer-motion';

export default function AdmissionsDashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Admissions Dashboard 📋</h1>
        <p className="text-primary-foreground/90 text-lg">
          Manage student applications and enrollment
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value="45"
          icon={ClipboardCheck}
          variant="primary"
          trend="+8 this week"
          delay={0.1}
        />
        <StatsCard
          title="Pending Review"
          value="12"
          icon={Clock}
          variant="warning"
          subtitle="Needs attention"
          delay={0.15}
        />
        <StatsCard
          title="Approved"
          value="28"
          icon={CheckCircle}
          variant="success"
          trend="62% approval rate"
          delay={0.2}
        />
        <StatsCard
          title="Rejected"
          value="5"
          icon={XCircle}
          variant="default"
          subtitle="11% rejection rate"
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
          <h3 className="text-sm font-semibold mb-4">Recent Applications</h3>
          <div className="space-y-3">
            {[
              { name: 'John Doe', grade: 'Grade 5', status: 'pending', time: '2 hours ago' },
              { name: 'Mary Jane', grade: 'Grade 6', status: 'approved', time: '3 hours ago' },
              { name: 'Bob Smith', grade: 'Grade 4', status: 'under_review', time: '5 hours ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.grade} • {item.time}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.status === 'approved' ? 'bg-success/10 text-success' :
                  item.status === 'pending' ? 'bg-warning/10 text-warning' :
                  'bg-primary/10 text-primary'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
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
            <QuickAction title="Review Applications" subtitle="12 pending" />
            <QuickAction title="Approve Batch" subtitle="Bulk approval" />
            <QuickAction title="Send Notifications" subtitle="Status updates" />
            <QuickAction title="View Reports" subtitle="Analytics" />
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
