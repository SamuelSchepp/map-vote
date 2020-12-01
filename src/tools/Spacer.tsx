import { Style } from "../Style";

function Spacer() {
  return (
    <div
      style={{
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: Style.padding
      }}
    >
    </div>
  )
}

export default Spacer;
