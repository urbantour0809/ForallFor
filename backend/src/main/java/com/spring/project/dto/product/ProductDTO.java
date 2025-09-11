package com.spring.project.dto.product;

public class ProductDTO {
    private int product_id;
    private String product_title;
    private String stitle;
    private String writer;
    private String publisher;
    private String content;
    private int page;
    private int price;
    private String languages;
    private int stock;
    private String product_image;

    // Getter & Setter
    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public String getProduct_title() {
        return product_title;
    }

    public void setProduct_title(String product_title) {
        this.product_title = product_title;
    }

    public String getStitle() {
        return stitle;
    }

    public void setStitle(String stitle) {
        this.stitle = stitle;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getProduct_image() {
        return product_image;
    }

    public void setProduct_image(String product_image) {
        this.product_image = product_image;
    }

    // toString
    @Override
    public String toString() {
        return "ProductDTO{" +
                "product_id=" + product_id +
                ", product_title='" + product_title + '\'' +
                ", stitle='" + stitle + '\'' +
                ", writer='" + writer + '\'' +
                ", publisher='" + publisher + '\'' +
                ", content='" + content + '\'' +
                ", page=" + page +
                ", price=" + price +
                ", languages='" + languages + '\'' +
                ", stock=" + stock +
                ", product_image='" + product_image + '\'' +
                '}';
    }
}
