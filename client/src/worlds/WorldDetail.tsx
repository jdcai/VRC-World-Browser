import styled from "styled-components";

const WorldDetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const WorldDetailTitle = styled.div`
    font-weight: bold;
`;

const WorldDetailValue = styled.div``;

interface WorldDetailProps {
    title: string;
    value: string | undefined;
    formattedDate?: string;
}

const WorldDetail = ({ title, value, formattedDate }: WorldDetailProps) => {
    return (
        <WorldDetailContainer>
            <WorldDetailTitle>{title}</WorldDetailTitle>
            <WorldDetailValue title={formattedDate}>{value ? value : "N/A"}</WorldDetailValue>
        </WorldDetailContainer>
    );
};

export default WorldDetail;
