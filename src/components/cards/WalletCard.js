import { Card } from "react-bootstrap";
import Image from "next/image";

const WalletCard = ({ className, label, icon = "", onClick }) => {
  return (
    <Card className={className} border="0" onClick={onClick}>
      <Card.Body className="text-center cursor-pointer">
        <Card.Title>
          <Image
            src={icon}
            alt={label}
            layout="fixed"
            width={110}
            height={60}
          />
        </Card.Title>
        <Card.Text>{label}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default WalletCard;
