CREATE TABLE `voyager_transactions` (
	`hash` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`block_hash` text NOT NULL,
	`block_number` integer NOT NULL,
	`contract_address` text,
	`timestamp` integer NOT NULL,
	`status` text NOT NULL,
	`finality_status` text NOT NULL
);
