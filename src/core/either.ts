export class Left<L> {
	readonly value: L;
	readonly _type = "Left" as const;

	constructor(value: L) {
		this.value = value;
	}

	isRight(): this is Left<L> {
		return false;
	}

	isLeft(): this is Left<L> {
		return true;
	}
}

export class Right<R> {
	readonly value: R;

	readonly _type = "Right" as const;

	constructor(value: R) {
		this.value = value;
	}

	isRight(): this is Right<R> {
		return true;
	}

	isLeft(): this is Right<R> {
		return false;
	}
}

export type Either<L, R> = Left<L> | Right<R>;

export const left = <L>(value: L): Left<L> => {
	return new Left<L>(value);
};

export const right = <R>(value: R): Right<R> => {
	return new Right<R>(value);
};
