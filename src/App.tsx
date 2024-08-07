import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import LoadingSpinner from './utils/modal/LoadingSpinnerModal';
import { AppDispatch } from './redux/Store';
import { setGlobalDispatch } from './redux/dispatchStore';
import RouteConfig from './routes/RouteConfig';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    setGlobalDispatch(dispatch);
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouteConfig />
    </Suspense>
  );
};

export default App;
