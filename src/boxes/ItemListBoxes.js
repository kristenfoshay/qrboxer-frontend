import React, { useState, useEffect } from "react";
import QRBoxerApi from "../api/api";
import ItemCard from "../items/ItemCard";

function ItemListBoxes({ id }) {
console.log("line 6", id);
  const [items, setItems] = useState(null);

  useEffect(() => {
    async function acquireItems() {
      let items = await QRBoxerApi.getItemsbyBox(id);
      setItems(items);
    }

    acquireItems();
  }, [id]);

  if (!items) return <p> No items in this box! </p>;

  return (
    <div className="Items col-md-8 offset-md-2">
      <div className="Items-list">
        {items.map(i => (
          <ItemCard
            key={i.id}
            id={i.id}
            description={i.description}
            image={i.image}
            box={i.box}
          />
        ))}
      </div>

    </div>
  );
}

export default ItemListBoxes;