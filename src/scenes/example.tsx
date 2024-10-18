import { makeScene2D, Rect, Layout, Node, Length, Circle, Txt } from "@motion-canvas/2d";
import { all, waitFor, makeRef, range, SignalValue, createSignal } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const MyRect = (height:number) => <Rect height={height + 50} width={225} lineWidth={5} stroke={"#88C0D0"} radius={rad}>
    <Layout direction={"column"} width={225} height={height+50} gap={0}  layout>
      <Rect height={50} fill={"#88C0D0"} alignItems={'center'} justifyContent={'center'}><Txt fontSize={30} fill={'white'} >0-0</Txt></Rect>
      <Layout direction={"column"} width={225} height={height} gap={10} justifyContent={'center'} paddingTop={10} paddingBottom={10} layout>
        {range(height / 100).map((x) => <Layout direction={"row"} height={100} gap={20} alignItems={'center'} justifyContent={'center'} layout>
          <Circle width={50} height={50} lineWidth={5} stroke={"#88C0D0"} alignItems={'center'} justifyContent={'center'}><Txt fontSize={20} fill={"#88C0D0"}>A</Txt></Circle>
          <Txt fontSize={30} fill={"#88C0D0"}>VS</Txt>
          <Circle width={50} height={50} lineWidth={5} stroke={"#88C0D0" } alignItems={'center'} justifyContent={'center'}><Txt fontSize={20} fill={"#88C0D0"}>B</Txt></Circle>
        </Layout>)}
        </Layout>
    </Layout>
    </Rect>;
  const rects: Rect[] = [];
  const rad = 5;
  const gapVertical = 15;
  view.add(
    <Layout direction={"row"} width={1820} height={800} gap={60} justifyContent={'center'} layout>
      <Layout direction={"column"} width={225} height={800} gap={gapVertical} justifyContent={'center'} layout>
          <Rect height={200} fill={"#88C0D0"}></Rect>
          {MyRect(800)}
      </Layout>
      <Layout direction={"column"} width={225} height={800} gap={gapVertical} justifyContent={'center'} layout>
          {MyRect(400)}
          {MyRect(400)}
      </Layout>
      <Layout direction={"column"} width={225} height={800} gap={gapVertical} justifyContent={'center'} layout>
          {MyRect(200)}
          {MyRect(400)}
          {MyRect(200)}
      </Layout>
      <Layout direction={"column"} width={225} height={800} gap={gapVertical} justifyContent={'center'} layout>
        {MyRect(100)}
        {MyRect(300)}
        {MyRect(300)}
        {MyRect(100)}
      </Layout>
      <Layout direction={"column"} width={225} height={800} gap={gapVertical} justifyContent={'center'} layout>
      {MyRect(100)}
          {MyRect(300)}
          {MyRect(100)}
      </Layout>
      <Layout direction={"column"} width={225} height={800} gap={gapVertical} justifyContent={'center'} layout>
        {MyRect(100)}
        {MyRect(100)}
      </Layout>
    </Layout>
  );

  yield* waitFor(1);

  // Animate them
  yield* all(
    ...rects.map((rect) => rect.position.y(100, 1).to(-100, 2).to(0, 1))
  );
});
