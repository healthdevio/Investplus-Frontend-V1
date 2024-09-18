import { Round } from './round';
import { Team } from './team';

export interface RoundPrototype {
    investidoPercent: any;
    investidoValue: any;
    reservadoPercent: any;
    reservadoValue: any;
    id?: number;
    name?: string;
    website?: string;
    model?: string;
    round: Round;
    executives: Team;
    advices: Team;
}
