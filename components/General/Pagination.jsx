import React from 'react';

export default function Pagination({ data, setPage }) {

    return (
        <ol className="custom-pagention">
            {
                data?.paginate?.total_pages > 1 &&
                Array.from({ length: data?.paginate?.total_pages }).map((_, index) => (
                    <li key={index}>
                        <button onClick={() => setPage(index + 1)} className={data.paginate.current_page === index + 1 ? 'active' : ''}>{index + 1}</button>
                    </li>

                ))
            }
            
        </ol>
    );
}

