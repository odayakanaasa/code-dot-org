import { assert } from '../../../util/configuredChai';
import React from 'react';
import { shallow } from 'enzyme';
import ProgressLevelSet from '@cdo/apps/templates/progress/ProgressLevelSet';
import { LevelStatus } from '@cdo/apps/util/sharedConstants';
import { fakeLevels, fakeLevel } from '@cdo/apps/templates/progress/progressTestHelpers';

describe('ProgressLevelSet', function () {
  it('has a pill and no bubbles for a single level', () => {
    const wrapper = shallow(
      <ProgressLevelSet
        name="My Level Name"
        levels={fakeLevels(1)}
        disabled={false}
      />
    );

    assert.equal(wrapper.find('ProgressPill').length, 1);
    assert.equal(wrapper.find('ProgressBubbleSet').length, 0);
    assert.equal(wrapper.find('ProgressPill').props().text, 'Level 1');
  });

  it('has a pill and bubbles when we have multiple levels', () => {
    const wrapper = shallow(
      <ProgressLevelSet
        name="My Progression Name"
        levels={fakeLevels(3)}
        disabled={false}
      />
    );

    assert.equal(wrapper.find('ProgressPill').length, 1);
    assert.equal(wrapper.find('ProgressBubbleSet').length, 1);
    assert.equal(wrapper.find('ProgressPill').props().text, 'Levels 1-3');
  });

  it('renders a pill that says UNPLUGGED when first level is unplugged', () => {
    const wrapper = shallow(
      <ProgressLevelSet
        name={undefined}
        levels={[
          fakeLevel({isUnplugged: true}),
          ...fakeLevels(5)
        ].map(level => ({...level, name: undefined }))}
        disabled={false}
      />
    );
    assert.equal(wrapper.find('ProgressPill').props().text, 'UNPLUGGED');
  });

});
