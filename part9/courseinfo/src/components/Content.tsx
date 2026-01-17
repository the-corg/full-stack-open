import type { CoursePart } from '../types';

export interface ContentProps {
  parts: CoursePart[];
}

const Content = ({ parts }: ContentProps) => (
  <>
    {parts.map(p => (
      <p key={p.name}>
        {p.name} {p.exerciseCount}
      </p>
    ))}
  </>
);

export default Content;
