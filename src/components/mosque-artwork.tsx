import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export function MosqueArtwork() {
  return (
    <View className="absolute bottom-0 right-0 h-[170px] w-[205px]" pointerEvents="none">
      <Svg
        width={205}
        height={170}
        viewBox="0 0 205 170"
        pointerEvents="none"
        accessibilityElementsHidden
      >
        <Circle cx="145" cy="47" r="34" fill="#5b8673" opacity={0.25} />
        <Path
          d="M45 170v-65h9v-7c-6-3-9-8-9-14 0-8 9-13 16-22 7 9 16 14 16 22 0 6-3 11-9 14v7h9v65ZM164 170V94h8v-6c-6-4-9-9-9-15 0-8 9-14 16-24 7 10 16 16 16 24 0 6-3 11-9 15v6h8v76Z"
          fill="#8eb4a3"
          opacity={0.42}
        />
        <Path d="M69 170v-39c0-32 20-52 48-59 28 7 48 27 48 59v39Z" fill="#8eb4a3" opacity={0.47} />
        <Path
          d="M117 72v-9m8-22a13 13 0 1 0 8 19 11 11 0 0 1-8-19Z"
          fill="#8eb4a3"
          stroke="#8eb4a3"
          strokeWidth={2}
          opacity={0.55}
        />
        <Rect x="76" y="132" width="82" height="38" fill="#8eb4a3" opacity={0.47} />
        <Path
          d="M105 170v-25a12 12 0 0 1 24 0v25M83 158v-14a7 7 0 0 1 14 0v14M138 158v-14a7 7 0 0 1 14 0v14"
          fill="#1a432f"
          opacity={0.35}
        />
        <Path
          d="M28 170v-24c0-13 8-21 19-26 11 5 19 13 19 26v24M174 170v-29c0-12 7-20 17-25 10 5 14 13 14 25v29"
          fill="#a6c5b4"
          opacity={0.35}
        />
      </Svg>
    </View>
  );
}
