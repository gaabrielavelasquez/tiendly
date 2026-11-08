# SQL migrations

Use ordered filenames such as `0001_identity_stores.sql`. Tables and columns use English names. This directory will contain the relational application schema; the D1 platform probe under `backend/probes/` is deliberately separate and is never an application migration.

Keep tenant IDs in composite keys and foreign keys. Store money in integer cents, instants in UTC, and offer/coupon dates as Lima calendar dates. Migrations must preserve historical order snapshots and the distinction between inherited, absent and custom measurement tables.

No application migration has been written or applied yet. Do not create a document-per-store table as a fallback.
