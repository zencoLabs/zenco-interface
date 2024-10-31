import { TextWithTooltip, TextWithTooltipProps } from '../FlowCommons/TextWithTooltip';
 

export const PriceTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip 
      {...rest}
    >
      <>
      Share price will go up when more people buy. And you can sell it anytime.<br/>
      price = 0.00006 * supply^2
      </>
    </TextWithTooltip>
  );
};
