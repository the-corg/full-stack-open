import type { CoursePart } from '../types';
import { assertNever } from '../utils';

export interface PartProps {
  part: CoursePart;
}

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case 'basic':
      return (
        <div style={{ margin: '15px 0' } as React.CSSProperties}>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          <div>
            <i>{part.description}</i>
          </div>
        </div>
      );
      break;
    case 'group':
      return (
        <div style={{ margin: '15px 0' } as React.CSSProperties}>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          <div>Group projects {part.groupProjectCount}</div>
        </div>
      );
      break;
    case 'background':
      return (
        <div style={{ margin: '15px 0' } as React.CSSProperties}>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          <div>
            <i>{part.description}</i>
          </div>
          <div>Background material: {part.backgroundMaterial}</div>
        </div>
      );
      break;
    case 'special':
      return (
        <div style={{ margin: '15px 0' } as React.CSSProperties}>
          <div>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </div>
          <div>
            <i>{part.description}</i>
          </div>
          <div>Required skills: {part.requirements.join(', ')}</div>
        </div>
      );
      break;
    default:
      return assertNever(part);
      break;
  }
};

export default Part;
