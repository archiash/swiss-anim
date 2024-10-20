import { makeScene2D, Rect, Layout, Length, Circle, Txt } from '@motion-canvas/2d';
import {
    range,
    SignalValue,
    createSignal,
    SimpleSignal,
    debug,
    createEffect,
    all,
    DEFAULT,
    createDeferredEffect,
    tween,
    chain,
    map,
    easeOutQuint,
    easeOutExpo,
    easeInOutExpo,
    waitFor,
    createRef,
    makeRef,
    createRefMap,
    easeInExpo,
    easeInOutElastic,
    easeInElastic,
    easeInCirc,
} from '@motion-canvas/core';
import { data } from '../data';
import { Team } from '../Team';
import { Result } from '../Result';

export default makeScene2D(function* (view) {
    const teamsCircle = createRefMap<Circle>();
    const teamText = createRefMap<Txt>();
    const cir = createRef<Circle>();
    const roundWidth = [createSignal(225), createSignal(225), createSignal(225)];
    const roundGap = roundWidth.map((x) => createSignal(20 + (x() - 225) / 5));
    createDeferredEffect(() => {
        roundGap.map((x, i) => x(20 + (roundWidth[i]() - 225) / 5));
    });
    const strokeColor = (isQualify: Boolean) => (isQualify ? '#ffffff00' : '#88C0D0');
    const fillColor = (isQualify: Boolean) => (isQualify ? '#88C0D0' : '#88c0d000');
    const textColor = (isQualify: Boolean) => (isQualify ? '#ffffff' : '#88C0D0');

    const Pair = (team1: string, team2: string, index: number, score: string) => (
        <Layout direction={'row'} width={roundWidth[index]} height={100} gap={roundGap[index]} alignItems={'center'} justifyContent={'center'} layout>
            <Circle
                ref={teamsCircle[team1 + score]}
                width={50}
                height={50}
                lineWidth={5}
                fill={fillColor(false)}
                stroke={strokeColor(false)}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Txt ref={teamText[team1 + score]} fontSize={20} fill={textColor(false)}>
                    {team1}
                </Txt>
            </Circle>
            <Txt fontSize={30} fill={'#88C0D0'}>
                VS
            </Txt>
            <Circle
                ref={teamsCircle[team2 + score]}
                width={50}
                height={50}
                lineWidth={5}
                stroke={'#88C0D0'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Txt ref={teamText[team2 + score]} fontSize={20} fill={'#88C0D0'}>
                    {team2}
                </Txt>
            </Circle>
        </Layout>
    );

    const Group = (team: number, score: string, height: number, index: number) => (teamPair: { team1: string; team2: string }[]) =>
        (
            <Rect height={height} width={roundWidth[index]} lineWidth={5} stroke={'#88C0D0'} radius={rad}>
                <Layout direction={'column'} width={roundWidth[index]} height={height} gap={0} layout>
                    <Rect height={50} fill={'#88C0D0'} alignItems={'center'} justifyContent={'center'}>
                        <Txt fontSize={30} fill={'white'}>
                            {score}
                        </Txt>
                    </Rect>
                    <Layout direction={'column'} height={height - 50} gap={10} justifyContent={'center'} alignItems={'center'} layout>
                        {range(team).map((x) => Pair(teamPair[x].team1, teamPair[x].team2, index, score))}
                    </Layout>
                </Layout>
            </Rect>
        );

    const Round =
        (groups: { size: number; score: string }[], height: number = 1000) =>
        (index: number) => {
            const teamCount = groups.reduce((p, c) => (p = p + c.size), 0);
            const heightWithoutGap = height - 15 * (groups.length - 1);
            return (
                <Layout direction={'column'} width={roundWidth[index]} height={1000} gap={gapVertical} justifyContent={'center'} layout>
                    {groups.map((i) =>
                        Group(i.size, i.score, (heightWithoutGap * i.size) / teamCount, index)(data.find((x) => x.score === i.score).pairs),
                    )}
                </Layout>
            );
        };

    const rad = 5;
    const gapVertical = 15;
    view.add(
        <Layout direction={'row'} width={1820} height={1200} gap={20} justifyContent={'center'} alignItems={'center'} layout>
            {Round([{ size: 8, score: '0-0' }])(0)}
            {Round([
                { size: 4, score: '1-0' },
                { size: 4, score: '0-1' },
            ])(1)}
            {Round([
                { size: 2, score: '2-0' },
                { size: 4, score: '1-1' },
                { size: 2, score: '0-2' },
            ])(2)}
            {/*                 {ColumnSet([
                    { size: 1, score: '3-0' },
                    { size: 3, score: '2-1' },
                    { size: 3, score: '1-2' },
                    { size: 1, score: '0-3' },
                ])} */}
            {/*                 {ColumnSet(
                    [
                        { size: 1, score: '3-1' },
                        { size: 3, score: '2-2' },
                        { size: 1, score: '1-3' },
                    ],
                    730,
                )} */}

            {/*                 {ColumnSet(
                    [
                        { size: 1, score: '3-2' },
                        { size: 1, score: '2-3' },
                    ],
                    420,
                )} */}
        </Layout>,
    );

    // Animate them
    yield* chain(
        tween(0.5, (value) => roundWidth[0](map(255, 500, easeInOutExpo(value)))),
        chain(
            ...Result[0].team.map((x) =>
                all(teamsCircle[x + Result[0].score]().fill(fillColor(true), 0.3, easeInCirc), teamText[x + Result[0].score]().fill(textColor(true), 0.3, easeInCirc)),
            ),
        ),
        waitFor(0.2),
        tween(0.5, (value) => roundWidth[0](map(500, 255, easeInOutExpo(value)))),
    );

    //yield* tween(2, value => {widthOne(map(255, 500, value))})
    //yield* all(...rects.map((rect) => rect.position.y(100, 1).to(-100, 2).to(0, 1)));
});
