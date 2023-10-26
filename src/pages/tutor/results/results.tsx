import { FC, useEffect, memo } from 'react';

import './results.scss';
import Groups from '../groups/groups.tsx';
import Tests from '../../student/tests/tests.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { clearSelectedStudent } from 'store/results/results.slice.ts';

const DEFAULT_CLASSNAME = 'results';

const Results: FC = memo(() => {
  const { selectedStudent } = useSelector((state: RootState) => state.results);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSelectedStudent());
    };
  }, [dispatch]);

  return (
    <div className={`${DEFAULT_CLASSNAME} ${!!selectedStudent && 'results-show-results'}`}>
      <div className={`${DEFAULT_CLASSNAME}_groups`}>
        <Groups viewMode />
      </div>
      {!!selectedStudent && (
        <div className={`${DEFAULT_CLASSNAME}_tests`}>
          <Tests resultsView />
        </div>
      )}
    </div>
  );
});

export default Results;
