import { TextWithTooltip, TextWithTooltipProps } from '../FlowCommons/TextWithTooltip';
 

export const AssetValueTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip 
      {...rest}
    >
      <>
       Total amount invested in this asset
      </>
    </TextWithTooltip>
  );
};
