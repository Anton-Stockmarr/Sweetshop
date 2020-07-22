CREATE OR REPLACE PROCEDURE addOrder(userId INTEGER, INOUT orderId INTEGER DEFAULT NULL)
AS $$
DECLARE
  order_time DATE :=CURRENT_DATE;
BEGIN
INSERT INTO "Orders" VALUES(DEFAULT, userId, order_time)
RETURNING "Orders"."id" INTO orderId;
INSERT INTO "Order_Items"
SELECT orderId, a."itemId", a."amount"
FROM "Temporary_Order" AS a;
UPDATE "Items"
SET quantity = quantity - amount
FROM "Temporary_Order"
WHERE "Items"."id" = "Temporary_Order"."itemId";
COMMIT;
END;
$$ LANGUAGE plpgsql;
