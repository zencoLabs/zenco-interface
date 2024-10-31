import { TextWithTooltip, TextWithTooltipProps } from '../FlowCommons/TextWithTooltip';
 

export const SharePriceTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip 
      {...rest}
    >
      <>
      Buy shares of a space to join it and share its revenue.
      </>
    </TextWithTooltip>
  );
};
