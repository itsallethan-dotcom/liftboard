type SiteSectionLabelProps = {
  children: string;
};

export function SiteSectionLabel({ children }: SiteSectionLabelProps) {
  return (
    <p className="forgeonix-section-label">
      {children}
    </p>
  );
}
