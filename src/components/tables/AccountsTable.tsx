import type { Account } from '../../types';
import BankLogo from '../ui/BankLogo';

const statusColors: Record<string, string> = {
  Hot: '#ef4444', 'Big Bet': '#8b5cf6', Active: '#10b981', Watch: '#f59e0b',
};

const statusBg: Record<string, string> = {
  Hot: '#fef2f2', 'Big Bet': '#f5f3ff', Active: '#f0fdf4', Watch: '#fffbeb',
};

export default function AccountsTable({ accounts }: { accounts: Account[] }) {
  const cols = ['ACCOUNT', 'FIT', 'VALUE', 'URGENCY', 'ENTRY', 'RELATIONSHIP', 'SIGNALS', 'STATUS'];

  return (
    <div className="card rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="table-header-row">
            {cols.map(c => (
              <th key={c} className="text-left px-4 py-3 text-xs font-semibold tracking-wide"
                style={{ color: 'var(--text-secondary)' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id} className="table-row border-t" style={{ borderColor: 'var(--border-color)' }}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <BankLogo name={a.name} size={34} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {a.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{a.fit}</td>
              <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{a.value}</td>
              <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{a.urgency}</td>
              <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{a.entry}</td>
              <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{a.relationship}</td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{a.signals}</td>
              <td className="px-4 py-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    color: statusColors[a.status] || '#64748b',
                    background: statusBg[a.status] || '#f8fafc',
                  }}>
                  {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
