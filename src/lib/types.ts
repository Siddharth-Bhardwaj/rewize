export interface LoadingSVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export type CardDetails = {
  id: string;
  name: string;
  issuer?: string | null;
  imageUrl?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  annualFee?: string | null;
  networkType?: string | null;
  description?: string | null;
};
