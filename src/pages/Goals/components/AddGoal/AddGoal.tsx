import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  CreateGoalData,
  GoalType,
} from '../../../../store/ducks/goal/contracts/state';
import { fetchGoalsData } from '../../../../store/ducks/goals/actionCreators';
import { AddGoalForm } from '../AddGoalForm/AddGoalForm';
import { AddGoalSelect } from '../AddGoalSelect/AddGoalSelect';

import s from './AddGoal.module.scss';

interface Props {}

export const AddGoal = (props: Props) => {
  const dispatch = useDispatch();
  const [goal, setGoal] = useState<CreateGoalData>({
    type: GoalType.WEIGHT,
    description: '',
    end_result: '',
    start_result: '',
    name: '',
  });

  const [next, setNext] = useState(false);

  useEffect(() => {
    dispatch(fetchGoalsData());
  }, [next, dispatch]);

  return (
    <div className={s.add__goal}>
      {!next && (
        <AddGoalSelect goal={goal} setNext={setNext} setGoal={setGoal} />
      )}
      {next && <AddGoalForm goal={goal} setNext={setNext} />}
    </div>
  );
};