type Seat = {
  id: string;
  label: string;
};

type SeatRow = {
  rowLabel: string;
  seats: Seat[];
};

type SeatMapProps = {
  rows: SeatRow[];
  booked: string[];
  locked: string[];
  selected: string[];
  onToggle: (seatId: string) => void;
};

export function SeatMap({ rows, booked, locked, selected, onToggle }: SeatMapProps) {
  return (
    <div className="seat-map">
      {rows.map((row) => (
        <div className="seat-row" key={row.rowLabel}>
          <strong>{row.rowLabel}</strong>
          {row.seats.map((seat) => {
            const isBooked = booked.includes(seat.id);
            const isLocked = locked.includes(seat.id);
            const isSelected = selected.includes(seat.id);
            const className = ["seat", isBooked ? "booked" : "", isLocked ? "locked" : "", isSelected ? "selected" : ""]
              .join(" ")
              .trim();

            return (
              <button
                key={seat.id}
                className={className}
                disabled={isBooked || isLocked}
                onClick={() => onToggle(seat.id)}
                aria-label={`Seat ${seat.label}`}
                title={`Seat ${seat.label}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
