import { AlignLeft } from "lucide-react";
import PageHeader from '../ui/PageHeader';

const EmptyView = ({ title }) => (
  <>
    <PageHeader title={title.toUpperCase()} subtitle="This section is under construction" />
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <AlignLeft size={36} className="text-white/10" strokeWidth={1} />
      <span className="font-barlow text-[11px] tracking-[0.2em] uppercase text-white/20">Content coming soon</span>
    </div>
  </>
);

export default EmptyView;
