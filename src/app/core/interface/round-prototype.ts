import { Round } from './round';
import { Team } from './team';

export interface RoundPrototype {
    id?: number;
    name?: string;
    website?: string;
    model?: string;
    round: Round;
    executives: Team;
    advices: Team;
}
