import React from 'react';
import AchievementDialog from './AchievementDialog';

const ExampleDialogButton = React.createClass({
  render() {
    return (
      <div>
        <AchievementDialog
          isOpen={!!this.state && this.state.open}
          handleClose={() => this.setState({open: false})}
          {...this.props}
        />
        <button onClick={() => this.setState({open: true})}>
          Open the example dialog
        </button>
      </div>
    );
  }
});

export default storybook => {
  return storybook
    .storiesOf('AchievementDialog', module)
    .addStoryTable([
      {
        name: 'Got all achievements',
        description: `3 checked boxes`,
        story: () => (
          <ExampleDialogButton
            achievements={[
              {
                check: true,
                msg: 'Puzzle completed!',
                progress: 0.02,
              }, {
                check: true,
                msg: 'Fewer than 12 block used!',
                progress: 0.04,
              }, {
                check: true,
                msg: 'Bonus: Using no hints',
                progress: 0.04,
              },
            ]}
            assetUrl={url => '/blockly/' + url}
            feedbackMessage={'Congratulations! You completed Puzzle 3.'}
            oldStageProgress={0.25}
            onContinue={storybook.action('continue')}
            showPuzzleRatingButtons={true}
            showStageProgress={true}
            tooManyBlocks={false}
          />
        )
      }, {
        name: 'Got some achievements wrong',
        description: `2 checked boxes, 1 unchcked box`,
        story: () => (
          <ExampleDialogButton
            achievements={[
              {
                check: true,
                msg: 'Puzzle completed!',
                progress: 0.02,
              }, {
                check: false,
                msg: 'Using too many blocks',
                progress: 0.04,
              }, {
                check: true,
                msg: 'Bonus: Using no hints',
                progress: 0.04,
              },
            ]}
            actualBlocks={5}
            assetUrl={url => '/blockly/' + url}
            feedbackMessage={'Congratulations! You completed Puzzle 3.'}
            oldStageProgress={0.25}
            onContinue={storybook.action('continue')}
            showPuzzleRatingButtons={true}
            showStageProgress={true}
            tooManyBlocks={false}
          />
        )
      }, {
        name: 'Not showing some achievements',
        description: `2 checked boxes`,
        story: () => (
          <ExampleDialogButton
            achievements={[
              {
                check: true,
                msg: 'Puzzle completed!',
                progress: 0.02,
              }, {
                check: false,
                msg: 'Using too many blocks',
                progress: 0.04,
              },
            ]}
            actualBlocks={5}
            assetUrl={url => '/blockly/' + url}
            feedbackMessage={'Congratulations! You completed Puzzle 3.'}
            oldStageProgress={0.25}
            onContinue={storybook.action('continue')}
            showPuzzleRatingButtons={true}
            showStageProgress={true}
            tooManyBlocks={false}
          />
        )
      }
    ]);
};
