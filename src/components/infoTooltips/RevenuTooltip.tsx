import { TextWithTooltip, TextWithTooltipProps } from '../FlowCommons/TextWithTooltip';
 

export const RevenuTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip 
      {...rest}
    >
      <>
      When people upvote/downvote contents, space will get a fee, which belongs to all holders of this space.
      </>
    </TextWithTooltip>
  );
};
