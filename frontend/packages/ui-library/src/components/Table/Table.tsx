import type { ReactNode } from 'react';
import './Table.scss';
export function Table({ headers, rows }: { headers: ReactNode[]; rows: ReactNode[][] }) { return <div className="health-table__responsive"><table className="health-table"><thead><tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }
