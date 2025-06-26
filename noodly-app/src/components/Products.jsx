import React from "react";
import { useMenuData } from "../hooks/useMenuData";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProductsHeader = styled.div`
  background: var(--noodly-blue);
  color: var(--noodly-yellow);
  padding: 30px 20px;
  border-radius: 15px;
  margin-bottom: 40px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
  color: var(--noodly-yellow);
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
  color: var(--noodly-yellow);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const ProductCard = styled.div`
  background: var(--noodly-yellow);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background: var(--noodly-blue);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomizableTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--noodly-blue);
  color: var(--noodly-yellow);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
`;

const ProductImage = styled.img`
  width: 80%;
  height: 100%;
  object-fit: contain;
`;

const ProductContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 16px;
  color: var(--noodly-blue);
  margin-bottom: 8px;
  font-weight: bold;
  text-transform: uppercase;
`;

const ProductDescription = styled.p`
  font-size: 12px;
  color: var(--noodly-blue);
  margin-bottom: 12px;
  flex-grow: 1;
  opacity: 0.8;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const OriginalPrice = styled.span`
  font-size: 14px;
  text-decoration: line-through;
  color: var(--noodly-blue);
  opacity: 0.7;
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: var(--noodly-blue);
`;

const CustomizeButton = styled.button`
  background: var(--noodly-blue);
  color: var(--noodly-yellow);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--noodly-blue);
  font-size: 18px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: red;
  font-size: 18px;
`;

const Products = () => {
  const { products, loading, error } = useMenuData();

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading delicious meals...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>Error: {error}</ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ProductsHeader>
        <Title>Our Menu</Title>
        <Subtitle>Fresh & Delicious Noodles</Subtitle>
      </ProductsHeader>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductImageContainer>
              {product.customizable && (
                <CustomizableTag>Customizable</CustomizableTag>
              )}
              <ProductImage
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/noodle-placeholder.jpg";
                }}
              />
            </ProductImageContainer>
            <ProductContent>
              <ProductName>{product.name}</ProductName>
              {product.description && (
                <ProductDescription>{product.description}</ProductDescription>
              )}
              <ProductFooter>
                <PriceContainer>
                  {product.discountedPrice > 0 ? (
                    <>
                      <OriginalPrice>${product.price.toFixed(2)}</OriginalPrice>
                      <Price>${product.discountedPrice.toFixed(2)}</Price>
                    </>
                  ) : (
                    <Price>${product.price.toFixed(2)}</Price>
                  )}
                </PriceContainer>
                {product.customizable && (
                  <CustomizeButton>Customize</CustomizeButton>
                )}
              </ProductFooter>
            </ProductContent>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};

export default Products;
