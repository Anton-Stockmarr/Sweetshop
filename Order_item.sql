CREATE TABLE "Order_Items" (
    "orderId" integer REFERENCES "Orders"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    "itemId" integer REFERENCES "Items"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    quantity text,
    PRIMARY KEY ("orderId","itemId")
);


CREATE UNIQUE INDEX "Order_Items_pkey" ON "Order_Items"("orderId" int4_ops);
CREATE UNIQUE INDEX "Order_Items_itemId_key" ON "Order_Items"("itemId" int4_ops);
