import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import LoadingSpinner from './utils/modal/LoadingSpinnerModal';
import { AppDispatch } from './redux/Store';
import { setGlobalDispatch } from './redux/dispatchStore';
import RouteConfig from './routes/RouteConfig';
import ErrorBoundary from './utils/errorboundary/errorBoundary';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    setGlobalDispatch(dispatch);
  }, [dispatch]);

  return (
    <ErrorBoundary>

    <Suspense fallback={<LoadingSpinner />}>
      <RouteConfig />
    </Suspense>
    </ErrorBoundary>
  );
};

export default App;
