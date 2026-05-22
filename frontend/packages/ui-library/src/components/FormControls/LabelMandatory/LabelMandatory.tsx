import './LabelMandatory.scss';
export function LabelMandatory({ label = 'required' }: { label?: string }) { return <abbr className="form-required" title={label}>*</abbr>; }
