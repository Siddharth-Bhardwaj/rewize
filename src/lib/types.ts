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

export type CardRecommendation = {
  cardId: string;
  cardName: string;
  categoryName: string;
  issuer: string | null;
  message: string | null;
  nickName: string | null;
  imageUrl: string | null;
  rewardRate: string | null;
  lastFourDigits: string | null;
};
