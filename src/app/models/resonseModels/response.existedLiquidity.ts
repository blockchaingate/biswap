export interface ResponseExistedLiquidity {
    pairAddress: string;
    tokens:      Token[];
}

export interface Token {
    tokenAName:     string;
    tokenACoinType: number;
    tokenBName:     string;
    tokenBCoinType: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toResponseExistedLiquidity(json: string): ResponseExistedLiquidity[] {
        return JSON.parse(json);
    }

    public static responseExistedLiquidityToJson(value: ResponseExistedLiquidity[]): string {
        return JSON.stringify(value);
    }
}
