import type { CoursePart } from '../types';
import Part from './Part';

export interface ContentProps {
  parts: CoursePart[];
}

const Content = ({ parts }: ContentProps) => (
  <>
    {parts.map(p => (
      <Part key={p.name} part={p} />
    ))}
  </>
);

export default Content;
