/* 404 NotFound */

import { Suspense } from "react";
interface Props {
  history?: History;
}

export default function NotFoundContainer(props: Props): JSX.Element {
  return (
    <Suspense fallback={null}>
      <div className="page-error">
        <div>
          <div className="title">404</div>
          <div className="info">Oh dear</div>
          <div className="info">这里什么也没有</div>
        </div>
      </div>
    </Suspense>
    
  );
}
