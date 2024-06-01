CREATE TABLE `voyager_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`header` blob NOT NULL,
	`max_fee` text,
	`usd_formatted_max_fee` text,
	`gas_consumed` text NOT NULL,
	`nonce` text,
	`version` text NOT NULL,
	`receipt` blob NOT NULL,
	`execution_resources` blob NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hash_idx` ON `voyager_transaction` (`id`);